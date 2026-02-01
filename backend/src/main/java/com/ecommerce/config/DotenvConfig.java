package com.ecommerce.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
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
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

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
            return envVars;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(envPath.toFile()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#"))
                    continue;

                int idx = line.indexOf('=');
                if (idx > 0) {
                    String key = line.substring(0, idx).trim();
                    String value = line.substring(idx + 1).trim();
                    envVars.put(key, value);
                }
            }
            System.out.println("Loaded " + envVars.size() + " variables from " + envPath);
        } catch (Exception e) {
            System.err.println("Error loading .env: " + e.getMessage());
        }

        return envVars;
    }

    private Path findEnvFile() {
        for (String path : new String[] { ".env", "backend/.env", "../.env" }) {
            Path p = Paths.get(path);
            if (Files.exists(p))
                return p;
        }
        return null;
    }
}
