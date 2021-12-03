package org.ungpung0.moviereview.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity             // DB의 테이블과 1:1로 매칭되는 객체 단위이다.
@Builder            // 빌더를 자동 생성하는 Lombok의 어노테이션.
@AllArgsConstructor // 파라미터가 없는 기본 생성자를 생성한다.
@NoArgsConstructor  // 모든 필드값을 파라미터를 받는 생성자를 생성한다.
@Getter             // Getter를 사용할 수 있다.
@ToString           // 메소드를 자동으로 생성해준다.
public class Movie {

    @Id // DB 테이블의 PK로 설정한다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK
    private Long mno;   // PK를 Long으로 설정하는 이유는 데드락을 방지하기 위해서이다.
                        // 데드락은 프로세스가 자원을 얻지 못해, 다음 처리가 불가능한 상태를 의미한다. = 교착상태
    private String title;
}
