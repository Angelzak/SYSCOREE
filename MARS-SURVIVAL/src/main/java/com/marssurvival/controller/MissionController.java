package com.marssurvival.controller;

import com.marssurvival.model.MarsLocation;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MissionController {

    @GetMapping("/api/locations")
    public List<MarsLocation> getLocations() {
        // Coordenadas ilustrativas para el mapa de la aplicación; no son coordenadas GPS.
        return List.of(
            new MarsLocation("olympus", "Monte Olimpo", "Volcán",
                "El mayor volcán conocido del sistema solar. Su relieve es muy elevado.",
                "Interés geológico; terreno difícil para una misión.", 23, 27),
            new MarsLocation("gale", "Cráter Gale", "Cráter",
                "Cráter de impacto explorado por el rover Curiosity.",
                "Las rocas permiten estudiar la historia ambiental de Marte.", 54, 52),
            new MarsLocation("valles", "Valles Marineris", "Cañón",
                "Un enorme sistema de cañones que atraviesa una región del planeta.",
                "Zona de interés geológico; bordes y pendientes peligrosos.", 72, 40),
            new MarsLocation("jezero", "Cráter Jezero", "Cráter",
                "Región explorada por el rover Perseverance, con señales de un antiguo delta.",
                "Interés para estudiar indicios de agua antigua.", 38, 68),
            new MarsLocation("hellas", "Cuenca Hellas", "Cuenca",
                "Una de las cuencas de impacto más grandes de Marte.",
                "Gran depresión; estudiar el terreno antes de planear una ruta.", 80, 75)
        );
    }

    @GetMapping("/api/status")
    public Map<String, Object> getStatus() {
        return Map.of(
            "mission", "Misión de reconocimiento",
            "environment", "Simulación educativa",
            "note", "Los indicadores y eventos de supervivencia son ficticios y sirven para el desafío."
        );
    }
}
