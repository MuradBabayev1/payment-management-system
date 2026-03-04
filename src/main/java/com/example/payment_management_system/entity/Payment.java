package com.example.payment_management_system.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("CompanyName")
    @Column(nullable = false)
    private String CompanyName;

    @JsonProperty("ServiceName")
    @Column(nullable = false)
    private String ServiceName;
    private String date;
    private double amount;
    private String status;

}
