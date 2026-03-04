package com.example.payment_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CompanyName", nullable = false)
    private String companyName;

    @Column(name = "ServiceName", nullable = false)
    private String serviceName;
    private String date;
    private double amount;
    private String status;

}
