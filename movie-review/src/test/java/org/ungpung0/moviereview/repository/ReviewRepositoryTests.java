package org.ungpung0.moviereview.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.ungpung0.moviereview.entity.Member;
import org.ungpung0.moviereview.entity.Movie;
import org.ungpung0.moviereview.entity.Review;

import java.util.stream.IntStream;

@SpringBootTest
public class ReviewRepositoryTests {

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    public void insertMovieReviews() {
        IntStream.rangeClosed(1,200).forEach(i -> { // 리뷰 200개 등록하기.

            Long mno = (long)(Math.random() * 100) + 1;   // 영화 번호.
            Long mid = ((long)(Math.random() * 100) + 1); // 리뷰어 번호.
            Member member = Member.builder()
                    .mid(mid).build();

            Review movieReview = Review.builder()
                    .member(member)
                    .movie(Movie.builder().mno(mno).build())
                    .grade((int)(Math.random() * 5) + 1) // (0 ~ 1) * 5 + 1.
                    .text("영화에 대한 느낌은..." + i)
                    .build();
            reviewRepository.save(movieReview);
        });
    }

}
