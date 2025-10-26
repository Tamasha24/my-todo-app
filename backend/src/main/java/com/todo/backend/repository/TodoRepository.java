package com.todo.backend.repository;

import com.todo.backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByDate(LocalDate date);
    List<Todo> findByDateBefore(LocalDate date);
    List<Todo> findByDateAfter(LocalDate date);
}


