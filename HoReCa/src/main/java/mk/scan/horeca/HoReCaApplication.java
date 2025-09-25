package mk.scan.horeca;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HoReCaApplication {

    public static void main(String[] args) {
        SpringApplication.run(HoReCaApplication.class, args);
    }

}
