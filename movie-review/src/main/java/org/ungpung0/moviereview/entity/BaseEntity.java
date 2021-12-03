package org.ungpung0.moviereview.entity;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass // 객체의 공통 매핑 정보가 필요할 때 사용한다.
@EntityListeners(value = {AuditingEntityListener.class}) // Entity가 DB로 불러오기 전후의 커스텀 로직을 선언하는 인터페이스.
@Getter                                                  // CreatedDate, LastModifiedDate, CreatedBy, LastModifiedBy 등을 자동 업데이트한다.
abstract class BaseEntity {

    @CreatedDate // 생성된 날짜.
    @Column(name = "regDate", updatable = false)
    private LocalDateTime regDate;

    @LastModifiedDate // 마지막 수정 날짜.
    @Column(name = "moddate")
    private LocalDateTime modDate;

}
