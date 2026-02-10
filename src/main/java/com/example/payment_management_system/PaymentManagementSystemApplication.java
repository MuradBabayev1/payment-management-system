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

	@Bean
	CommandLineRunner commandLineRunner(PaymentRepository repository) {
		return args -> {
			Payment p1 = new Payment(null, "Azercell", "Internet", "10.10.2024", 20.50, "Odenilib");
			Payment p2 = new Payment(null, "Azerisiq", "Internet", "10.10.2024", 100.50, "Odenilib");
			Payment p3 = new Payment(null, "Azersu", "Internet", "10.10.2024", 94.50, "Odenilib");

			repository.saveAll(List.of(p1,p2,p3));

			System.out.println(">>> Melumatlar ugurla yuklendi");

		};
	}

}
