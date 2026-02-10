package com.example.payment_management_system.entity;


import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor @AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;
}
