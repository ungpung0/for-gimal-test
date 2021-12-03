package org.ungpung0.moviereview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ungpung0.moviereview.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
