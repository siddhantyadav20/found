// Draw a title card for a trailer (2026-10-24): lines of type on black, centred.
//
//   swiftc -O scripts/card.swift -o <card tool>
//   <card tool> spec.json
//
// spec: { out, width, height, lines: [{ text, font, size, color: "#rrggbb", y (0..1, from the top), tracking? }] }
// Fonts are the Mac's own (Georgia, Helvetica Neue): the site's faces aren't installed system-wide.
import CoreGraphics
import CoreText
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct Line: Decodable { let text: String; let font: String; let size: Double; let color: String; let y: Double; let tracking: Double? }
struct Spec: Decodable { let out: String; let width: Int; let height: Int; let lines: [Line] }

let spec = try! JSONDecoder().decode(Spec.self, from: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])))

func rgb(_ hex: String) -> CGColor {
    let v = UInt32(hex.dropFirst(), radix: 16) ?? 0xffffff
    return CGColor(red: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255, blue: CGFloat(v & 0xff) / 255, alpha: 1)
}

let ctx = CGContext(data: nil, width: spec.width, height: spec.height, bitsPerComponent: 8, bytesPerRow: 0,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(red: 0.02, green: 0.02, blue: 0.02, alpha: 1))
ctx.fill(CGRect(x: 0, y: 0, width: spec.width, height: spec.height))

for l in spec.lines {
    let font = CTFontCreateWithName(l.font as CFString, CGFloat(l.size), nil)
    var attrs: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTForegroundColorAttributeName as String): rgb(l.color),
    ]
    if let t = l.tracking { attrs[NSAttributedString.Key(kCTKernAttributeName as String)] = t }
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: l.text, attributes: attrs))
    let w = CTLineGetTypographicBounds(line, nil, nil, nil)
    ctx.textPosition = CGPoint(x: (Double(spec.width) - w) / 2, y: Double(spec.height) * (1 - l.y))
    CTLineDraw(line, ctx)
}

let img = ctx.makeImage()!
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: spec.out) as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, img, [kCGImageDestinationLossyCompressionQuality: 0.9] as CFDictionary)
CGImageDestinationFinalize(dest)
print("wrote", spec.out)
