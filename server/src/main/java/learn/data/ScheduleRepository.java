package learn.data;

import learn.model.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository {
    List<Schedule> findAll();

    Schedule findById(int scheduleId);

    List<Schedule> findDatesByEmployee(int employeeId);

    List<Schedule> findByDate(LocalDate scheduleDate);

    Schedule create(Schedule schedule);

    boolean update(Schedule schedule);

    boolean delete(int scheduleId);


}
