package com.regweb.event;

public class EventStatsResponse {
    private long totalEvents;
    private long totalRegistrations;
    private long activeEvents;
    private double capacityUtilization;

    public EventStatsResponse() {}

    public EventStatsResponse(long totalEvents, long totalRegistrations, long activeEvents, double capacityUtilization) {
        this.totalEvents = totalEvents;
        this.totalRegistrations = totalRegistrations;
        this.activeEvents = activeEvents;
        this.capacityUtilization = capacityUtilization;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getActiveEvents() {
        return activeEvents;
    }

    public void setActiveEvents(long activeEvents) {
        this.activeEvents = activeEvents;
    }

    public double getCapacityUtilization() {
        return capacityUtilization;
    }

    public void setCapacityUtilization(double capacityUtilization) {
        this.capacityUtilization = capacityUtilization;
    }
}
