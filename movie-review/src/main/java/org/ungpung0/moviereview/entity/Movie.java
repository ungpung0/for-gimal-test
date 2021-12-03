package org.ungpung0.moviereview.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity     // DB의 테이블과 1:1로 매칭되는 객체 단위이다.
@Builder    //
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Movie {

    @Id // DB 테이블의 PK로 설정한다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK
    private Long mno;   // PK를 Long으로 설정하는 이유는 데드락을 방지하기 위해서이다.
                        // 데드락은 프로세스가 자원을 얻지 못해, 다음 처리가 불가능한 상태를 의미한다. = 교착상태
    private String title;
}
