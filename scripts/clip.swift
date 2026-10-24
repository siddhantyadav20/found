// Build one of a chapter's video clips from still frames (2026-10-24).
//
// A phone's video, the way it looks: slow drift in on each frame (a hand
// can't hold still), a little handheld shake, a hard white muzzle flash
// where a caption says a shot, a vignette, and black where the recording
// stops. Then the soundtrack (scripts/clips.py) is laid under it.
//
// Run:  swift scripts/clip.swift <spec.json>
// The spec: { out, width, height, fps, seconds, audio?, shake?, blackFrom?,
//             shots: [{ image, start, end, z0, z1, x0, y0, x1, y1 }],
//             flashes: [{ at, dur }] }

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

struct Shot: Decodable { let image: String; let start: Double; let end: Double; let z0: Double; let z1: Double; let x0: Double; let y0: Double; let x1: Double; let y1: Double }
struct Flash: Decodable { let at: Double; let dur: Double }
struct Spec: Decodable {
    let out: String; let width: Int; let height: Int; let fps: Int; let seconds: Double
    let audio: String?; let shake: Double?; let blackFrom: Double?
    let shots: [Shot]; let flashes: [Flash]
}

func load(_ path: String) -> CGImage {
    let url = URL(fileURLWithPath: path)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        fatalError("can't read \(path)")
    }
    return img
}

let specPath = CommandLine.arguments[1]
let spec = try JSONDecoder().decode(Spec.self, from: Data(contentsOf: URL(fileURLWithPath: specPath)))
let images = Dictionary(uniqueKeysWithValues: Set(spec.shots.map(\.image)).map { ($0, load($0)) })

let W = spec.width, H = spec.height
let tmp = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(UUID().uuidString + ".mov")
let writer = try AVAssetWriter(outputURL: tmp, fileType: .mov)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: W,
    AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 420_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: spec.fps * 2,
    ],
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: W,
    kCVPixelBufferHeightKey as String: H,
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let space = CGColorSpaceCreateDeviceRGB()
let vignette = CGGradient(colorsSpace: space, colors: [CGColor(gray: 0, alpha: 0), CGColor(gray: 0, alpha: 0.55)] as CFArray, locations: [0.55, 1])!

/// Draw one shot at its own progress `p` (0..1), with an alpha and an offset for the shake.
func draw(_ ctx: CGContext, _ s: Shot, _ p: Double, alpha: CGFloat, dx: CGFloat, dy: CGFloat) {
    let img = images[s.image]!
    let iw = Double(img.width), ih = Double(img.height)
    // Cover the frame, then zoom in by z around (x, y).
    let cover = max(Double(W) / iw, Double(H) / ih)
    let e = p * p * (3 - 2 * p)
    let z = s.z0 + (s.z1 - s.z0) * e
    let scale = cover * z
    let cx = (s.x0 + (s.x1 - s.x0) * e) * iw
    let cy = (s.y0 + (s.y1 - s.y0) * e) * ih
    var ox = Double(W) / 2 - cx * scale
    var oy = Double(H) / 2 - cy * scale
    // Never show past the picture's edge.
    ox = min(0, max(Double(W) - iw * scale, ox))
    oy = min(0, max(Double(H) - ih * scale, oy))
    // CoreGraphics' y runs up: flip the picture's own top to the frame's top.
    let rect = CGRect(x: ox + Double(dx), y: Double(H) - (oy + ih * scale) + Double(dy), width: iw * scale, height: ih * scale)
    ctx.setAlpha(alpha)
    ctx.interpolationQuality = .high
    ctx.draw(img, in: rect)
    ctx.setAlpha(1)
}

let frames = Int((spec.seconds * Double(spec.fps)).rounded())
let fade = 0.35
for i in 0..<frames {
    let t = Double(i) / Double(spec.fps)
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
    guard let buf = pb else { fatalError("no pixel buffer") }
    CVPixelBufferLockBaseAddress(buf, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(buf), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buf), space: space, bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
    ctx.setFillColor(CGColor(gray: 0, alpha: 1))
    ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))

    let black = spec.blackFrom.map { t >= $0 } ?? false
    if !black {
        let a = CGFloat(spec.shake ?? 0.004) * CGFloat(W)
        let dx = a * CGFloat(sin(t * 11.3) + 0.6 * sin(t * 6.1 + 1.3))
        let dy = a * CGFloat(cos(t * 9.7) + 0.5 * sin(t * 4.3))
        for (k, s) in spec.shots.enumerated() where t >= s.start - fade && t <= s.end {
            let p = max(0, min(1, (t - s.start) / (s.end - s.start)))
            var alpha: CGFloat = 1
            // Cross-dissolve into a shot from the one before it.
            if k > 0 && t < s.start { alpha = CGFloat((t - (s.start - fade)) / fade) }
            draw(ctx, s, p, alpha: alpha, dx: dx, dy: dy)
        }
        ctx.drawRadialGradient(vignette, startCenter: CGPoint(x: W / 2, y: H / 2), startRadius: 0, endCenter: CGPoint(x: W / 2, y: H / 2), endRadius: CGFloat(max(W, H)) * 0.72, options: [.drawsAfterEndLocation])
        for f in spec.flashes where t >= f.at && t < f.at + f.dur {
            let k = 1 - (t - f.at) / f.dur
            ctx.setFillColor(CGColor(red: 1, green: 0.96, blue: 0.88, alpha: CGFloat(0.9 * k)))
            ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
        }
    }
    CVPixelBufferUnlockBaseAddress(buf, [])
    adaptor.append(buf, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: CMTimeScale(spec.fps)))
}
input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { fatalError("writer: \(String(describing: writer.error))") }

// Lay the soundtrack under the picture, and write the mp4.
let comp = AVMutableComposition()
let video = AVURLAsset(url: tmp)
let vt = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
let range = CMTimeRange(start: .zero, duration: video.duration)
try vt.insertTimeRange(range, of: video.tracks(withMediaType: .video)[0], at: .zero)
if let a = spec.audio {
    let audio = AVURLAsset(url: URL(fileURLWithPath: a))
    if let src = audio.tracks(withMediaType: .audio).first {
        let at = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
        try at.insertTimeRange(CMTimeRange(start: .zero, duration: min(audio.duration, video.duration)), of: src, at: .zero)
    }
}
let out = URL(fileURLWithPath: spec.out)
try? FileManager.default.removeItem(at: out)
let export = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetPassthrough)!
export.outputURL = out
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true
let exported = DispatchSemaphore(value: 0)
export.exportAsynchronously { exported.signal() }
exported.wait()
guard export.status == .completed else { fatalError("export: \(String(describing: export.error))") }
try? FileManager.default.removeItem(at: tmp)
print("wrote \(spec.out)")
