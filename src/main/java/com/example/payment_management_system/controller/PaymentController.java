package com.example.payment_management_system.controller;


import java.util.List;
import java.util.Locale;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment_management_system.entity.Payment;
import com.example.payment_management_system.repository.PaymentRepository;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @PostMapping
    public Payment savePayment(@RequestBody Payment payment) {
        payment.setStatus(normalizeStatus(payment.getStatus()));
        return paymentRepository.save(payment);
    }
    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable("id") Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable("id") Long id, @RequestBody Payment updatedPayment) {
        Payment existingPayment = paymentRepository.findById(id).orElse(null);
        if (existingPayment != null) {
            existingPayment.setCompanyName(updatedPayment.getCompanyName());
            existingPayment.setServiceName(updatedPayment.getServiceName());
            existingPayment.setAmount(updatedPayment.getAmount());
            existingPayment.setDate(updatedPayment.getDate());
            existingPayment.setStatus(normalizeStatus(updatedPayment.getStatus()));
            return paymentRepository.save(existingPayment);
        }
        return null;
    }

    private String normalizeStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.trim().isEmpty()) {
            return "Gözləyir";
        }

        String normalized = rawStatus
                .trim()
                .toLowerCase(Locale.ROOT)
                .replace("ö", "o")
                .replace("ə", "e")
                .replace("ı", "i")
                .replace("ş", "s")
                .replace("ğ", "g")
                .replace("ç", "c")
                .replace("ü", "u");

        if (normalized.equals("odenilib") || normalized.equals("paid")) {
            return "Ödənilib";
        }

        if (normalized.equals("gozleyir") || normalized.equals("pending")) {
            return "Gözləyir";
        }

        return rawStatus;
    }
}


