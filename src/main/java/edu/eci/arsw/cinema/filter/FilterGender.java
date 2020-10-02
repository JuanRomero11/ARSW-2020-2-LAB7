/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.filter;

import org.springframework.stereotype.Service;
import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Movie;
import java.util.ArrayList;
import java.util.List;
/**
 *
 * @author AsusPC
 */
@Service("FilterGender")
public class FilterGender implements Filter{

    @Override
    public List<Movie> filter(Cinema Cinema,String genre, String date) {
        List<Movie> filterMovies = new ArrayList<Movie>();
        for(CinemaFunction f:Cinema.getFunctions()){
            if(f.getMovie().getGenre().equals(genre)){
                // System.out.println(f.getMovie().getName());
                filterMovies.add(f.getMovie());
            }
        }
        
        return filterMovies;
        
    }
    
}
