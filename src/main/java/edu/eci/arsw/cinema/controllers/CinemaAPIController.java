/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.controllers;

import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import edu.eci.arsw.cinema.persistence.*;
import edu.eci.arsw.cinema.model.*;
import edu.eci.arsw.cinema.services.CinemaServices;
import java.util.List;
import java.util.logging.Level;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;
import org.springframework.web.bind.annotation.*;
/**
 *
 * @author cristian
 */
@RestController
@RequestMapping(value = "/cinemas")
@Service
public class CinemaAPIController {
    @Autowired
    CinemaServices cinemaServices;
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllCinemas() {
         try {
            return new ResponseEntity<>(cinemaServices.getAllCinemas(), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(edu.eci.arsw.cinema.controllers.CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error bla bla bla",HttpStatus.NOT_FOUND);
        }
    }
    /**
     @RequestMapping(value = "/{name}/{namemovie}/{date}", method = RequestMethod.GET)
    public ResponseEntity<?> getFunctionByMovieName(@PathVariable String name,  @PathVariable String namemovie, @PathVariable String date) {   
        try {
            System.out.println("AQUI LLEGUE PERO ME VOY A MORIR  "+name+" "+namemovie+" "+date);
            return new ResponseEntity<>(cinemaServices.getFunctionByMovieName(name,namemovie, date), HttpStatus.ACCEPTED);
        } catch(CinemaException ex) {
            Logger.getLogger(edu.eci.arsw.cinema.controllers.CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("HTTP 404",HttpStatus.NOT_FOUND);
        }
    }
    * */
    
    @RequestMapping(value="/{name}", method= RequestMethod.GET)
    public ResponseEntity<?> getCinemasName(@PathVariable String name) {
         try {
            return new ResponseEntity<>(cinemaServices.getCinemaByName(name), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(edu.eci.arsw.cinema.controllers.CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("HTTP 404",HttpStatus.NOT_FOUND);
        }
    }
    @RequestMapping(value="/{name}/{date}", method= RequestMethod.GET)
    public ResponseEntity<?> getCinemasNameAndDate(@PathVariable String name,@PathVariable String date) {
         try {
            return new ResponseEntity<>(cinemaServices.getFunctionsbyCinemaAndDate(name,date), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(edu.eci.arsw.cinema.controllers.CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("HTTP 404",HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(value="/{name}/{date}/{moviename}", method = RequestMethod.GET)
    public ResponseEntity<?> getMoviebyCinemaAndDate(@PathVariable String name, @PathVariable String date, @PathVariable String moviename) throws CinemaPersistenceException, CinemaException {
        try {
            CinemaFunction b = null;
            List<CinemaFunction> a = cinemaServices.getFunctionsbyCinemaAndDate(name, date);
            for (CinemaFunction i : a) {
                if (i.getMovie().getName().equals(moviename)) {
                    b = i;
                }
            }
            if (b == null) {
                throw new CinemaPersistenceException("No se encontro la funcion " + date);
            }
            return new ResponseEntity<>(b.getSeats(), HttpStatus.ACCEPTED);
        } catch (CinemaPersistenceException ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("HTTP 404", HttpStatus.NOT_FOUND);
        }

    }
    @RequestMapping(value = "/{name}", method = RequestMethod.PUT)
    public ResponseEntity<?> putResourceCinemaByName(@PathVariable String name,@RequestBody CinemaFunction cf) {
        try {
            cinemaServices.updateFunction(name, cf);
            return new ResponseEntity<>(cinemaServices.getCinemaByName(name), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }
    @RequestMapping(value="/{name}", method= RequestMethod.POST)
    public ResponseEntity<?> postResourceFunctionbyCinema(@RequestBody CinemaFunction function,@PathVariable String name) {
         try {
            cinemaServices.addNewFunction(function,name);
            return new ResponseEntity<>(cinemaServices.getCinemaByName(name), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(edu.eci.arsw.cinema.controllers.CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("HTTP 404",HttpStatus.NOT_FOUND);
        }
    }
    @RequestMapping(value = "/{name}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteFunction(@PathVariable String name, @RequestBody CinemaFunction funcion) {
        if (funcion.getMovie() == null || funcion.getDate() == null) {
            return new ResponseEntity<>("JSON Bad Format", HttpStatus.BAD_REQUEST);
        }
        try {
            cinemaServices.delete(name, funcion);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            if (ex.getMessage().equals("No existe el cine" + name)) {
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
            }
        }
    }

}
