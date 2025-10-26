package com.todo.backend.controller;

import com.todo.backend.model.Todo;
import com.todo.backend.repository.TodoRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoRepository repository;

    public TodoController(TodoRepository repository) {
        this.repository = repository;
    }


    
@GetMapping
public List<Todo> getAllTodosDefault() {
    return repository.findAll();
}


   
    @GetMapping("/today")
    public List<Todo> getTodayTodos() {
        return repository.findByDate(LocalDate.now());
    }




    @GetMapping("/overdue")
    public List<Todo> getOverdueTodos() {
        return repository.findByDateBefore(LocalDate.now());
    }


  
    @GetMapping("/upcoming")
    public List<Todo> getUpcomingTodos() {
        return repository.findByDateAfter(LocalDate.now());
    }

  
    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        if (todo.getDate() == null) {
            todo.setDate(LocalDate.now());
        }
        todo.setCompleted(false);
        return repository.save(todo);
    }


   

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        Todo existing = repository.findById(id).orElseThrow();
        existing.setTitle(todo.getTitle());
        existing.setDate(todo.getDate()); 
        existing.setCompleted(todo.isCompleted());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
