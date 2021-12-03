package org.ungpung0.moviereview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ungpung0.moviereview.entity.MovieImage;

public interface MovieImageRepository extends JpaRepository<MovieImage, Long> {

}
