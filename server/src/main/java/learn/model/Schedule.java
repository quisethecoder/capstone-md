package learn.model;

import java.time.LocalDate;
import java.util.Objects;

public class Schedule {
    private int scheduleId;
    private LocalDate scheduleDate;
    private Employee employee;
    private Seat seat;

    public Schedule(int scheduleId, LocalDate scheduleDate, Employee employee, Seat seat) {
        this.scheduleId = scheduleId;
        this.scheduleDate = scheduleDate;
        this.employee = employee;
        this.seat = seat;
    }

    public Schedule() {

    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Schedule schedule = (Schedule) o;
        return scheduleId == schedule.scheduleId && Objects.equals(scheduleDate, schedule.scheduleDate) && Objects.equals(employee, schedule.employee) && Objects.equals(seat, schedule.seat);
    }

    @Override
    public int hashCode() {
        return Objects.hash(scheduleId, scheduleDate, employee, seat);
    }
}
