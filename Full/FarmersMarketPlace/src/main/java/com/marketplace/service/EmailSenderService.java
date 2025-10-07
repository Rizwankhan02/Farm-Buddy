/*
// EMAIL VERIFICATION FUNCTIONALITY DISABLED
//
// This file contains the EmailSenderService class which has been disabled
// to remove email verification requirements from the application.
//
// All email-related functionality including:
// - Order confirmation emails
// - Receipt sending
// - Email verification
// has been removed from the application.

package com.marketplace.service;

import java.io.File;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.marketplace.pojos.CartItem;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PdfExportService pdfExportService;

    public void sendReceiptEmail(String toEmail, List<CartItem> items) throws Exception {
        String pdfPath = "receipt.pdf";
        pdfExportService.export(items); // generates receipt.pdf
        sendEmailWithAttachment(toEmail, "Here is your purchase receipt.", "Farmers Marketplace Receipt", pdfPath);
    }

    public void sendEmailWithAttachment(String toEmail, String body, String subject, String attachment)
            throws MessagingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("gcp991@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, false); // false = plain text. use true for HTML.

        FileSystemResource file = new FileSystemResource(new File(attachment));
        helper.addAttachment(file.getFilename(), file);

        mailSender.send(mimeMessage);
        System.out.println("Mail Sent...");
    }
}
*/

// Email verification has been disabled
// The EmailSenderService class is commented out to remove email functionality
