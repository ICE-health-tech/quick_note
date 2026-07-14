package com.quicknote.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

	@Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:4173,https://quicknote.icestore.art}")
	private String allowedOrigins;

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		final String[] origins = allowedOrigins.split(",");
		for (int i = 0; i < origins.length; i++) {
			origins[i] = origins[i].trim();
		}

		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins(origins)
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(false);
			}
		};
	}
}
