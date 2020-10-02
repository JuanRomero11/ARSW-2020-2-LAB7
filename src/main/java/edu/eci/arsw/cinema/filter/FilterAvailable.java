/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.filter;
import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Movie;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
/**
 *
 * @author AsusPC
 */
@Service("FilterAvailable")
public class FilterAvailable implements Filter{

    @Override
    public List<Movie> filter(Cinema Cinema, String disponibilidad, String Date) {
        int numeroAsientos = Integer.parseInt(disponibilidad);
        List<Movie> filterMovies = new ArrayList<Movie>();
        int x = 0;

        for (CinemaFunction f : Cinema.getFunctions()) {
            if (f.getDate().equals(Date) && AsientosDisponibles(f.getSeats())>= numeroAsientos) {
                filterMovies.add(f.getMovie());
            }
        }
        return filterMovies;
    }
    public int AsientosDisponibles(List<List<Boolean>> matriz){
        int x=0;
        for(List<Boolean> i: matriz){
            for(Boolean k: i){
                if(k){
                    x++;
                }
            }
        }
        return x;
    }
    
    
}
