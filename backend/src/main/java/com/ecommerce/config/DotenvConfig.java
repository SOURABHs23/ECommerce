package com.ecommerce.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Loads environment variables from .env file
 */
@Configuration
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static final Logger logger = LoggerFactory.getLogger(DotenvConfig.class);

    @Override
    public void initialize(ConfigurableApplicationContext ctx) {
        Map<String, Object> envVars = loadEnvFile();
        if (!envVars.isEmpty()) {
            ctx.getEnvironment().getPropertySources().addFirst(new MapPropertySource("dotenv", envVars));
        }
    }

    private Map<String, Object> loadEnvFile() {
        Map<String, Object> envVars = new HashMap<>();
        Path envPath = findEnvFile();

        if (envPath == null) {
            logger.warn(".env file not found, skipping loading.");
            return envVars;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(envPath.toFile()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                // Skip empty lines and comments
                if (line.isEmpty() || line.startsWith("#"))
                    continue;

                // Handle basic KEY=VALUE
                int idx = line.indexOf('=');
                if (idx > 0) {
                    String key = line.substring(0, idx).trim();
                    String value = line.substring(idx + 1).trim();

                    // Remove quotes if present
                    if (value.startsWith("\"") && value.endsWith("\"")) {
                        value = value.substring(1, value.length() - 1);
                    } else if (value.startsWith("'") && value.endsWith("'")) {
                        value = value.substring(1, value.length() - 1);
                    }

                    envVars.put(key, value);
                    // Critical: Set as system property for Spring's @Value to resolve
                    System.setProperty(key, value);
                }
            }
            logger.info("Loaded {} variables from {}", envVars.size(), envPath.toAbsolutePath());
        } catch (Exception e) {
            logger.error("Error loading .env file from {}: {}", envPath, e.getMessage());
        }

        return envVars;
    }

    private Path findEnvFile() {
        // Try current directory
        Path p = Paths.get(".env");
        if (Files.exists(p))
            return p;

        // Try backend directory (if running from project root)
        p = Paths.get("backend/.env");
        if (Files.exists(p))
            return p;

        // Try parent directory (if running from a subdir)
        p = Paths.get("../.env");
        if (Files.exists(p))
            return p;

        return null;
    }
}
