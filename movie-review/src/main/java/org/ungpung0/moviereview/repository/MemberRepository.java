package org.ungpung0.moviereview.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ungpung0.moviereview.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
