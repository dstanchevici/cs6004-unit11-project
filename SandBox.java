import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

public class SandBox {
    public static void main(String[] args) {
        LocalDate current = java.time.LocalDate.now();
        String dateStr = String.valueOf(current);
        System.out.println(dateStr);
    }
}
