import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs/promises';
import * as path from 'path';
import { InvoiceEntity } from '../../common/entity/invoice.entity';
import { BookingEntity } from '../../common/entity/booking.entity';

@Injectable()
export class PdfService {
  private readonly storageRoot = path.join(process.cwd(), 'storage');
  private readonly baseUrl = '/storage';

  constructor() {
    this.ensureStorageDirs();
  }

  private async ensureStorageDirs() {
    const dirs = ['invoices', 'contracts'];
    for (const dir of dirs) {
      const fullPath = path.join(this.storageRoot, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
    }
  }

  private async savePdf(
    pdfBytes: Uint8Array,
    type: 'invoice' | 'contract',
  ): Promise<string> {
    const dir = type === 'invoice' ? 'invoices' : 'contracts';
    const filename = `${type}-${Date.now()}.pdf`;
    const filePath = path.join(this.storageRoot, dir, filename);

    await fs.writeFile(filePath, pdfBytes);
    return `${this.baseUrl}/${dir}/${filename}`;
  }

  async generateContract(contractData: any): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]); // Format A4 en points
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // En-tête
    page.drawText("CONTRAT D'ABONNEMENT", {
      x: 50,
      y: height - 50,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    // Détails du contrat
    let yPosition = height - 100;

    // Informations de l'entreprise
    page.drawText('Contrat entre :', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
    });
    yPosition -= 30;

    page.drawText(`${contractData.company.name}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    yPosition -= 50;

    // Conditions du contrat
    page.drawText("Détails de l'abonnement :", {
      x: 50,
      y: yPosition,
      size: 14,
      font,
    });
    yPosition -= 25;

    const details = [
      `Date de début : ${contractData.startDate.toLocaleDateString()}`,
      `Date de fin : ${contractData.endDate.toLocaleDateString()}`,
      `Prix : ${contractData.price.toFixed(2)} €`,
      `Renouvelable : ${contractData.renewable ? 'Oui' : 'Non'}`,
    ];

    details.forEach((detail) => {
      page.drawText(detail, {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
      yPosition -= 20;
    });

    yPosition -= 30;

    // Conditions générales
    page.drawText('Conditions générales :', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
    });
    yPosition -= 25;

    const conditions = this.splitTextIntoLines(
      contractData.conditions ||
        "Les conditions générales standard s'appliquent.",
      100,
    );
    conditions.forEach((line) => {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 10,
        font: regularFont,
      });
      yPosition -= 15;
    });

    // Signatures
    yPosition = 150;
    page.drawText('Signatures autorisées', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
    });
    yPosition -= 40;

    // Signature de l'entreprise
    page.drawText('Pour ' + contractData.company.name, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    page.drawLine({
      start: { x: 50, y: yPosition - 10 },
      end: { x: 250, y: yPosition - 10 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Signature du fournisseur
    page.drawText('Pour CareSync', {
      x: 300,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    page.drawLine({
      start: { x: 300, y: yPosition - 10 },
      end: { x: 500, y: yPosition - 10 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return this.savePdf(pdfBytes, 'contract');
  }

  async generateInvoicePdf(invoiceData: any): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]); // Format A4 en points
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // En-tête
    page.drawText('FACTURE', {
      x: 50,
      y: height - 50,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    // Détails de la facture
    let yPosition = height - 100;

    page.drawText(`Numéro de facture : ${invoiceData.invoiceNumber}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    yPosition -= 20;

    page.drawText(`Date : ${invoiceData.invoiceDate.toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    yPosition -= 20;

    page.drawText(
      `Date d'échéance : ${invoiceData.dueDate.toLocaleDateString()}`,
      {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
      },
    );
    yPosition -= 40;

    // Client
    page.drawText('Client :', {
      x: 50,
      y: yPosition,
      size: 14,
      font,
    });
    yPosition -= 20;

    page.drawText(invoiceData.company.name, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    yPosition -= 40;

    // Articles
    page.drawText('Description', {
      x: 50,
      y: yPosition,
      size: 12,
      font,
    });
    page.drawText('Montant', {
      x: width - 100,
      y: yPosition,
      size: 12,
      font,
    });
    yPosition -= 20;

    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    // Article de facture
    page.drawText(`Paiement d'abonnement (${invoiceData.paymentReference})`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    page.drawText(`${invoiceData.totalAmount.toFixed(2)} €`, {
      x: width - 100,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    yPosition -= 40;

    // Total
    page.drawText('Total dû :', {
      x: width - 350,
      y: yPosition,
      size: 14,
      font,
    });
    page.drawText(`${invoiceData.totalAmount.toFixed(2)} €`, {
      x: width - 100,
      y: yPosition,
      size: 14,
      font,
    });

    // Statut de paiement
    yPosition -= 50;
    page.drawText(
      `Statut : ${invoiceData.status === 'payed' ? 'PAYÉ' : 'IMPAYÉ'}`,
      {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: invoiceData.status === 'PAYED' ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
      },
    );

    const pdfBytes = await pdfDoc.save();
    return this.savePdf(pdfBytes, 'invoice');
  }

  private splitTextIntoLines(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  async generateInvoicePDF(
    invoice: InvoiceEntity,
    bookings: any[],
  ): Promise<string> {
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Add a page
      let page = pdfDoc.addPage([612, 792]); // US Letter size
      const { width, height } = page.getSize();

      // Define margins and spacing
      const margin = 50;
      let yPosition = height - margin;
      const lineHeight = 15;

      // Company and provider info section - French text
      page.drawText('FACTURE', {
        x: width / 2 - helveticaBold.widthOfTextAtSize('FACTURE', 24) / 2,
        y: yPosition,
        size: 24,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      yPosition -= 40;

      // Provider information - French text
      page.drawText('Prestataire:', {
        x: margin,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`ID: ${invoice.provider?.id || 'N/A'}`, {
        x: margin,
        y: yPosition - lineHeight,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Company information (billed to) - French text
      page.drawText('Client:', {
        x: width - margin - 200,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`ID Entreprise: ${invoice.company?.id || 'N/A'}`, {
        x: width - margin - 200,
        y: yPosition - lineHeight,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Nom: ${invoice.company?.name || 'Inconnu'}`, {
        x: width - margin - 200,
        y: yPosition - lineHeight * 2,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Invoice details - French text
      yPosition -= 70;

      page.drawText('Détails de la facture:', {
        x: margin,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Numéro: ${invoice.invoiceNumber}`, {
        x: margin,
        y: yPosition - lineHeight,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(
        `Date: ${invoice.invoiceDate.toLocaleDateString('fr-FR')}`,
        {
          x: margin,
          y: yPosition - lineHeight * 2,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        },
      );

      page.drawText(
        `Date d'échéance: ${invoice.dueDate.toLocaleDateString('fr-FR')}`,
        {
          x: margin,
          y: yPosition - lineHeight * 3,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        },
      );

      // Table header for services - French text
      yPosition -= 100;

      // Draw table header
      const tableTop = yPosition;
      const tableLeft = margin;
      const colWidths = [60, 150, 100, 100, 100];
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

      // Draw header background
      page.drawRectangle({
        x: tableLeft,
        y: tableTop - lineHeight,
        width: tableWidth,
        height: lineHeight * 1.5,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      // Draw header text - French
      const headers = ['Date', 'Service', 'Employé', 'Prix', 'Statut'];
      let xPos = tableLeft;

      headers.forEach((header, i) => {
        page.drawText(header, {
          x: xPos + 5,
          y: tableTop - 5,
          size: 10,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
        xPos += colWidths[i];
      });

      yPosition -= lineHeight * 1.5;

      // Group bookings by employee for better organization
      const bookingsByEmployee = this.groupBookingsByEmployee(bookings);

      // Draw table rows
      let totalAmount = 0;

      for (const employeeId in bookingsByEmployee) {
        const employeeBookings = bookingsByEmployee[employeeId];
        const firstBooking = employeeBookings[0];
        const employeeName =
          `${firstBooking.employee?.lastName || ''} ${firstBooking.employee?.name || ''}`.trim() ||
          'Inconnu';

        // Check if we need a new page for this employee's services
        if (yPosition < margin + 100) {
          // Add a new page
          page.drawText('Suite au verso...', {
            x: width / 2 - 50,
            y: margin / 2,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });

          const newPage = pdfDoc.addPage([612, 792]);
          yPosition = height - margin;

          // Redraw the table header on the new page
          const tableTop = yPosition - 20;

          // Draw header background
          newPage.drawRectangle({
            x: tableLeft,
            y: tableTop - lineHeight,
            width: tableWidth,
            height: lineHeight * 1.5,
            color: rgb(0.9, 0.9, 0.9),
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });

          // Draw header text
          let xPos = tableLeft;
          headers.forEach((header, i) => {
            newPage.drawText(header, {
              x: xPos + 5,
              y: tableTop - 5,
              size: 10,
              font: helveticaBold,
              color: rgb(0, 0, 0),
            });
            xPos += colWidths[i];
          });

          yPosition = tableTop - lineHeight * 1.5;
          page = newPage;
        }

        // Draw employee's bookings
        for (const booking of employeeBookings) {
          const price = Number(booking.service?.price ?? 0);
          totalAmount += price;

          // Draw table row background (alternating colors)
          page.drawRectangle({
            x: tableLeft,
            y: yPosition - lineHeight,
            width: tableWidth,
            height: lineHeight * 1.2,
            color: rgb(1, 1, 1), // White background
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 0.5,
          });

          // Draw row data
          let xPos = tableLeft;

          // Date
          page.drawText(booking.bookingDate.toLocaleDateString('fr-FR'), {
            x: xPos + 5,
            y: yPosition - 5,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          xPos += colWidths[0];

          // Service
          const serviceName = booking.service?.title || 'Service inconnu';
          page.drawText(this.truncateText(serviceName, 25), {
            x: xPos + 5,
            y: yPosition - 5,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          xPos += colWidths[1];

          // Employee
          page.drawText(this.truncateText(employeeName, 15), {
            x: xPos + 5,
            y: yPosition - 5,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          xPos += colWidths[2];

          // Price
          page.drawText(`${price.toFixed(2)} €`, {
            x: xPos + 5,
            y: yPosition - 5,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          xPos += colWidths[3];

          // Status - French translation
          const statusMap = {
            confirmed: 'Confirmé',
            pending: 'En attente',
            completed: 'Terminé',
            cancelled: 'Annulé',
            no_show: 'Non présenté',
            PAYED: 'PAYÉ',
            PENDING: 'EN ATTENTE',
          };
          const statusText = statusMap[booking.status] || booking.status;

          page.drawText(statusText, {
            x: xPos + 5,
            y: yPosition - 5,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });

          yPosition -= lineHeight * 1.2;

          // Add service description in small text if available
          if (booking.service?.description) {
            page.drawText(
              `Description: ${this.truncateText(booking.service.description, 70)}`,
              {
                x: tableLeft + 20,
                y: yPosition - 5,
                size: 8,
                font: helveticaFont,
                color: rgb(0.3, 0.3, 0.3),
              },
            );
            yPosition -= lineHeight;
          }

          // Check if we need a new page
          if (yPosition < margin + 100) {
            // Add a new page
            page.drawText('Suite au verso...', {
              x: width / 2 - 50,
              y: margin / 2,
              size: 10,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });

            const newPage = pdfDoc.addPage([612, 792]);
            yPosition = height - margin;

            // Redraw the table header on the new page
            const tableTop = yPosition - 20;

            // Draw header background
            newPage.drawRectangle({
              x: tableLeft,
              y: tableTop - lineHeight,
              width: tableWidth,
              height: lineHeight * 1.5,
              color: rgb(0.9, 0.9, 0.9),
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
            });

            // Draw header text
            let xPos = tableLeft;
            headers.forEach((header, i) => {
              newPage.drawText(header, {
                x: xPos + 5,
                y: tableTop - 5,
                size: 10,
                font: helveticaBold,
                color: rgb(0, 0, 0),
              });
              xPos += colWidths[i];
            });

            yPosition = tableTop - lineHeight * 1.5;
            page = newPage;
          }
        }

        // Add a small gap between employees
        yPosition -= lineHeight * 0.5;
      }

      // Total amount - French text
      yPosition -= lineHeight * 1.5;

      page.drawLine({
        start: {
          x: tableLeft + tableWidth - colWidths[4],
          y: yPosition + lineHeight / 2,
        },
        end: { x: tableLeft + tableWidth, y: yPosition + lineHeight / 2 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      page.drawText('Montant total:', {
        x: tableLeft + tableWidth - colWidths[4] - 80,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${invoice.totalAmount.toFixed(2)} €`, {
        x: tableLeft + tableWidth - colWidths[4] + 5,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      // Payment instructions - French text
      yPosition -= lineHeight * 3;

      page.drawText('Instructions de paiement:', {
        x: margin,
        y: yPosition,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;

      const paymentInstructions = [
        'Veuillez effectuer le paiement dans les 30 jours suivant la date de facturation.',
        'Référence de paiement: ' + invoice.invoiceNumber,
        'Les coordonnées bancaires seront fournies séparément.',
        'Pour toute question concernant cette facture, veuillez contacter le prestataire directement.',
      ];

      for (const instruction of paymentInstructions) {
        page.drawText(instruction, {
          x: margin,
          y: yPosition,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      }

      // Footer - French text
      page.drawText(
        'Cette facture est générée électroniquement et ne nécessite pas de signature.',
        {
          x: width / 2 - 200,
          y: margin,
          size: 8,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
        },
      );

      // Save the PDF using the existing savePdf method to ensure consistent storage
      const pdfBytes = await pdfDoc.save();
      return this.savePdf(pdfBytes, 'invoice');
    } catch (error) {
      console.error(
        `Échec de la génération du PDF de facture: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private groupBookingsByEmployee(
    bookings: BookingEntity[],
  ): Record<string, BookingEntity[]> {
    const result: Record<string, BookingEntity[]> = {};

    for (const booking of bookings) {
      const employeeId = booking.employee?.id.toString() || 'unknown';

      if (!result[employeeId]) {
        result[employeeId] = [];
      }

      result[employeeId].push(booking);
    }

    return result;
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }
}

