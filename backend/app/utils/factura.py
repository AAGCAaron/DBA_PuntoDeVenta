"""
Generación de comprobantes de venta en formato XML y PDF.
Ambos formatos reflejan el mismo contenido: datos del ticket de compra.
"""
import io
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom.minidom import parseString


# ─── XML ─────────────────────────────────────────────────────────────────────

def generar_xml(venta_id: int, fecha_hora: datetime, monto_total: float,
                detalles: list, nombre_usuario: str = "N/A",
                nombre_cliente: str = "Público General") -> bytes:
    """
    Genera un comprobante de venta en XML con estructura inspirada en CFDI.
    Retorna bytes UTF-8.

    detalles: lista de dicts con claves:
        nombre_producto, cantidad, precio_unitario, subtotal
    """
    root = Element("Comprobante")
    root.set("xmlns", "http://pos-tiendita.unam.mx/cfdi")
    root.set("Version", "1.0")
    root.set("Folio", str(venta_id))
    root.set("Fecha", fecha_hora.strftime("%Y-%m-%dT%H:%M:%S"))
    root.set("TipoCambio", "1")
    root.set("Moneda", "MXN")
    root.set("Total", f"{monto_total:.2f}")

    emisor = SubElement(root, "Emisor")
    emisor.set("Nombre", "POS Tiendita")
    emisor.set("RFC", "XAXX010101000")
    emisor.set("RegimenFiscal", "612")

    receptor = SubElement(root, "Receptor")
    receptor.set("Nombre", nombre_cliente)
    receptor.set("Cajero", nombre_usuario)

    conceptos = SubElement(root, "Conceptos")
    for d in detalles:
        concepto = SubElement(conceptos, "Concepto")
        concepto.set("Descripcion", d["nombre_producto"])
        concepto.set("Cantidad", str(d["cantidad"]))
        concepto.set("ValorUnitario", f"{float(d['precio_unitario']):.2f}")
        concepto.set("Importe", f"{float(d['subtotal']):.2f}")

    totales = SubElement(root, "Totales")
    totales.set("SubTotal", f"{monto_total:.2f}")
    totales.set("Total", f"{monto_total:.2f}")

    # Pretty-print
    raw = tostring(root, encoding="unicode")
    pretty = parseString(raw).toprettyxml(indent="  ", encoding="UTF-8")
    return pretty  # bytes


# ─── PDF ─────────────────────────────────────────────────────────────────────

def generar_pdf(venta_id: int, fecha_hora: datetime, monto_total: float,
                detalles: list, nombre_usuario: str = "N/A",
                nombre_cliente: str = "Público General") -> bytes:
    """
    Genera un ticket/factura en PDF usando ReportLab.
    Retorna bytes del PDF.
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.enums import TA_CENTER, TA_RIGHT

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    PRIMARY = colors.HexColor("#1a73e8")
    DARK = colors.HexColor("#222222")
    MUTED = colors.HexColor("#666666")

    title_style = ParagraphStyle(
        "Title", parent=styles["Heading1"],
        fontSize=22, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=2
    )
    sub_style = ParagraphStyle(
        "Sub", parent=styles["Normal"],
        fontSize=9, textColor=MUTED, alignment=TA_CENTER, spaceAfter=1
    )
    label_style = ParagraphStyle(
        "Label", parent=styles["Normal"],
        fontSize=9, textColor=MUTED
    )
    value_style = ParagraphStyle(
        "Value", parent=styles["Normal"],
        fontSize=10, textColor=DARK
    )
    total_style = ParagraphStyle(
        "Total", parent=styles["Normal"],
        fontSize=14, textColor=PRIMARY, alignment=TA_RIGHT, fontName="Helvetica-Bold"
    )

    story = []

    # Header
    story.append(Paragraph("POS Tiendita", title_style))
    story.append(Paragraph("Comprobante de Venta", sub_style))
    story.append(Paragraph("RFC: XAXX010101000 &nbsp;|&nbsp; Régimen: 612", sub_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    # Metadata table
    meta = [
        [Paragraph("Folio:", label_style), Paragraph(f"#{venta_id:06d}", value_style),
         Paragraph("Fecha:", label_style), Paragraph(fecha_hora.strftime("%d/%m/%Y %H:%M"), value_style)],
        [Paragraph("Cajero:", label_style), Paragraph(nombre_usuario, value_style),
         Paragraph("Cliente:", label_style), Paragraph(nombre_cliente, value_style)],
    ]
    meta_table = Table(meta, colWidths=[25 * mm, 65 * mm, 25 * mm, 65 * mm])
    meta_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#dddddd"), spaceAfter=8))

    # Detalle table
    header = ["Producto", "Cant.", "P. Unit.", "Subtotal"]
    rows = [header]
    for d in detalles:
        rows.append([
            d["nombre_producto"],
            str(d["cantidad"]),
            f"${float(d['precio_unitario']):,.2f}",
            f"${float(d['subtotal']):,.2f}",
        ])

    detail_table = Table(rows, colWidths=[90 * mm, 18 * mm, 30 * mm, 32 * mm])
    detail_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("ALIGN", (1, 0), (-1, 0), "CENTER"),
        # Data rows
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f5f8ff")]),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
        ("ALIGN", (2, 1), (-1, -1), "RIGHT"),
        ("ALIGN", (3, 1), (-1, -1), "RIGHT"),
        # Grid
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#dddddd")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(detail_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    # Total
    story.append(Paragraph(f"TOTAL:&nbsp;&nbsp;&nbsp;${monto_total:,.2f} MXN", total_style))
    story.append(Spacer(1, 16))

    # Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#dddddd"), spaceAfter=6))
    footer_style = ParagraphStyle("Footer", parent=styles["Normal"],
                                  fontSize=8, textColor=MUTED, alignment=TA_CENTER)
    story.append(Paragraph("Generado automáticamente por POS Tiendita — UNAM FI BDA 2026-2", footer_style))
    story.append(Paragraph("Este comprobante no tiene validez fiscal oficial.", footer_style))

    doc.build(story)
    return buf.getvalue()
