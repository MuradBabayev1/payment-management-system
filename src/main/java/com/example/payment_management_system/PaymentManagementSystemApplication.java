package com.example.payment_management_system;

import com.example.payment_management_system.entity.Payment;
import com.example.payment_management_system.repository.PaymentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;




import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class PaymentManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentManagementSystemApplication.class, args);
	}



}
