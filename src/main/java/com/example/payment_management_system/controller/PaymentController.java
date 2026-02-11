package com.example.payment_management_system.controller;


import com.example.payment_management_system.entity.Payment;
import com.example.payment_management_system.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return paymentRepository.save(payment);
    }
    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable("id") Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Payment updatePayment(@PathVariable("id") Long id, @RequestBody Payment updatedPayment) {
        updatedPayment.setId(id);
        return paymentRepository.save(updatedPayment);
    }
}


