package com.marssurvival.model;

public class MarsLocation {
    private final String id;
    private final String name;
    private final String type;
    private final String description;
    private final String interest;
    private final int x;
    private final int y;

    public MarsLocation(String id, String name, String type, String description,
                        String interest, int x, int y) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.interest = interest;
        this.x = x;
        this.y = y;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getInterest() { return interest; }
    public int getX() { return x; }
    public int getY() { return y; }
}
