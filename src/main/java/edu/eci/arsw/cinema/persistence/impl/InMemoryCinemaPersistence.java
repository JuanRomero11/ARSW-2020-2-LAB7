/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence.impl;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Movie;
import edu.eci.arsw.cinema.persistence.CinemaException;
import edu.eci.arsw.cinema.persistence.CinemaPersistenceException;
import edu.eci.arsw.cinema.persistence.CinemaPersitence;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

/**
 *
 * @author cristian
 */
@Service("InMemoryCinemaPersistence")
public class InMemoryCinemaPersistence implements CinemaPersitence {

    private final ConcurrentMap<String, Cinema> cinemas = new ConcurrentHashMap<>();

    public InMemoryCinemaPersistence() {
        //load stub data
        String functionDate = "2018-12-18";
        List<CinemaFunction> functions = new ArrayList<>();
        CinemaFunction funct1 = new CinemaFunction(new Movie("SuperHeroes Movie", "Action"), "2018-12-19 17:00");
        CinemaFunction funct2 = new CinemaFunction(new Movie("The Night", "Horror"), "2018-12-18 15:30");
        functions.add(funct1);
        functions.add(funct2);
        Cinema c = new Cinema("cinemaX", functions);
        cinemas.put("cinemaX", c);
        
        String functionDate2 = "2018-12-18";
        List<CinemaFunction> functions2 = new ArrayList<>();
        CinemaFunction funct12 = new CinemaFunction(new Movie("La vengaza de Danielo", "Action"), "2018-12-18 15:30");
        CinemaFunction funct22 = new CinemaFunction(new Movie("La vengaza de Karón", "Horror"), "2018-12-18 15:30");
        functions2.add(funct12);
        functions2.add(funct22);
        Cinema c2 = new Cinema("CineColombia", functions2);
        cinemas.put("CineColombia", c2);
        
        String functionDate3 = "2018-12-18";
        List<CinemaFunction> functions3 = new ArrayList<>();
        CinemaFunction funct13= new CinemaFunction(new Movie("El entierro de Andres", "Action"), "2018-12-18 15:30");
        CinemaFunction funct23 = new CinemaFunction(new Movie("El entierro de Juan", "Horror"), "2018-12-18 15:30");
        functions3.add(funct13);
        functions3.add(funct23);
        Cinema c3 = new Cinema("Procinal", functions3);
        cinemas.put("Procinal", c3);
    }

    @Override
    public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException {
        Cinema t = cinemas.get(cinema);       
        for (CinemaFunction f : t.getFunctions()) {
            if (f.getMovie().getName().equals(movieName) && f.getDate().equals(date)) {
                f.buyTicket(row, col);
            }
        }

    }

    @Override
    public List<CinemaFunction> getFunctionsbyCinemaAndDate(String cinema, String date) {
        List<CinemaFunction> c = new ArrayList<>();
        Cinema t = cinemas.get(cinema);
        for(CinemaFunction f: t.getFunctions()){
            if (f.getDate().equals(date)) {
                c.add(f);
            }
        }
        return c;

    }

    @Override
    public void saveCinema(Cinema c) throws CinemaPersistenceException {
        if (cinemas.containsKey(c.getName())) {
            throw new CinemaPersistenceException("The given cinema already exists: " + c.getName());
        } else {
            cinemas.put(c.getName(), c);
        }
    }

    @Override
    public Cinema getCinema(String name) throws CinemaPersistenceException {
        return cinemas.get(name);
    }

    @Override
    public List<Cinema> getCinemas() {
        List<Cinema> cinemas2 =new ArrayList<Cinema>();
        for (Entry<String, Cinema> o : cinemas.entrySet()) {
            cinemas2.add(o.getValue());
        }
        return cinemas2;
    }

    @Override
    public void addCinema(Cinema c) {
        cinemas.put(c.getName(),c);
    }

    @Override
    public void addFunctionInCinema(String nameCinema, CinemaFunction function) {
        cinemas.get(nameCinema).addFunction(function);
    }

    @Override
    public void updateFunction(String name, CinemaFunction function) {
        CinemaFunction z = null;
        System.out.println(function+" HOLIWIIS");
        for (CinemaFunction k : cinemas.get(name).getFunctions()) {
            if (k.getMovie().getGenre().equals(function.getMovie().getGenre()) && k.getDate().substring(0, 10).equals(function.getDate().substring(0, 10)) && k.getMovie().getName().equals(function.getMovie().getName())) {
                z = k;
            }
        }
        if (z != null) {
            z.setMovie(function.getMovie());
            z.setDate(function.getDate());
        }
        else {
           addFunctionInCinema(name, function);
       }
    }

    @Override
    public CinemaFunction getFunctionByMovieName(String name, String nameMovie, String date) {
        CinemaFunction z = null;
        for (CinemaFunction k : cinemas.get(name).getFunctions()) {
            if (k.getDate().substring(0, 10).equals(date.substring(0, 10)) && k.getMovie().getName().equals(name)) {
                z = k;
            }
        }
        return z;
    }

	@Override
	public void detele(String name, CinemaFunction funcion) {
		 System.out.println(name+"   toy fuera xd");
		for (CinemaFunction k : cinemas.get(name).getFunctions()) {
            if (k.getMovie().getGenre().equals(funcion.getMovie().getGenre()) && k.getDate().substring(0, 10).equals(funcion.getDate().substring(0, 10)) && k.getMovie().getName().equals(funcion.getMovie().getName())) {
                cinemas.get(name).delete(funcion);
                System.out.println(name+"nombre xd");
            }
        }
		
       
	}

   
    

}
