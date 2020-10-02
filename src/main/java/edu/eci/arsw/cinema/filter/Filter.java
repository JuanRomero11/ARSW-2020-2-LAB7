/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.filter;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.Movie;
import java.util.List;

/**
 *
 * @author AsusPC
 */
 
public interface Filter {
    
    public List<Movie> filter(Cinema Cinema,String filtro, String date);
    
}
