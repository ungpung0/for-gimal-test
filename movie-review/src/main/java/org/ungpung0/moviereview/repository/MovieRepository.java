package org.ungpung0.moviereview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ungpung0.moviereview.entity.Movie;

// JpaRepository<클래스, ID> : 인터페이스에 검색 메소드를 정의하는 것.
public interface MovieRepository extends JpaRepository<Movie, Long> {

}
