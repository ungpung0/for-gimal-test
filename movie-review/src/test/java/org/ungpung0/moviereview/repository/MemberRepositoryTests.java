package org.ungpung0.moviereview.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.ungpung0.moviereview.entity.Member;

import java.util.stream.IntStream;

@SpringBootTest
public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void insertMembers() {

        IntStream.rangeClosed(1,100).forEach(i -> {

            Member member = Member.builder()
                    .email("r" + i + "@test.com")
                    .pw("1234")
                    .nickname("reviwer" + i).build();
            memberRepository.save(member);

        });

    }
}
