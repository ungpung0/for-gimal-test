package org.ungpung0.moviereview.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.ungpung0.moviereview.entity.Movie;
import org.ungpung0.moviereview.entity.MovieImage;

import java.util.UUID;
import java.util.stream.IntStream;

@SpringBootTest // 스프링 테스트 어노테이션.
public class MovieRepositoryTests {

    @Autowired                               // 필요한 의존 객체의 타입에 해당하는 빈을 찾아 주입한다.
    private MovieRepository movieRepository; // 빈이란 Spring에 관리당하는 자바 객체를 말한다.

    @Autowired
    private MovieImageRepository movieImageRepository;

    @Commit        // DB의 업데이트 결과를 확인하기 위한 어노테이션.
    @Transactional // 트랜잭션 처리를 지원하는 어노테이션으로 @Test에서 Update, Delete 문의 사용에 필요하다.
    @Test
    public void insertMovies() { // 영화를 삽입하는 테스트 함수.
        IntStream.rangeClosed(1,100).forEach(i -> { // 1에서 100까지 반복하는 자바 전용 단축 반복문. Intstream.rangeClosed(첫,끝).forEach(i -> {});

            Movie movie = Movie.builder()
                    .title("Movie...." + i).build();
            System.out.println("=========================");
            movieRepository.save(movie); // Movie 객체가 save된 후에는 mno가 할당되므로, 이용하여 이미지들을 추가할 수 있다.

            int count = (int)(Math.random() * 5) + 1; // 1,2,3,4
            for(int j = 0; j < count; j++) {
                MovieImage movieImage = MovieImage.builder()
                        .uuid(UUID.randomUUID().toString())
                        .movie(movie)
                        .imgName("test" + j + " .jpg").build();
                movieImageRepository.save(movieImage);
            }
            System.out.println("=========================");
        });
    }

}
