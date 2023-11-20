import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import com.google.gson.*;

class DataFromManageApplications {



    String servletAction;

}

public class ManageServlet extends HttpServlet {

    static String outputJson = "";
    static Connection conn;
    static Statement statement;

    public ManageServlet () {
        try {
            Class.forName ("org.h2.Driver");
            conn = DriverManager.getConnection (
                    "jdbc:h2:~/Desktop/myservers/databases/rinkjobs",
                    "sa",
                    ""
            );
            statement = conn.createStatement();
            System.out.println ("ManageServlet: successful connection to H2 dbase");
        }
        catch (Exception e) {
            // Bad news if we reach here.
            e.printStackTrace ();
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("ManageServlet: doPost");
        handleRequest(req, resp);
    }


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("ManageServlet: doGet");
        handleRequest(req, resp);
    }

    public void handleRequest(HttpServletRequest req, HttpServletResponse resp)
    {
        try {
            // We are going to extract the string line by line (not pretty code):
            StringBuffer sbuf = null;
            BufferedReader bufReader = null;
            String inputStr = null;

            bufReader = req.getReader ();
            sbuf = new StringBuffer ();
            while ((inputStr = bufReader.readLine()) != null) {
                sbuf.append (inputStr);
            }

            // What's in the buffer is the entire JSON string.
            String jStr = sbuf.toString();
            System.out.println ("Received: " + jStr);

            // WRITE CODE TO PARSE THE RECEIVED JSON into the
            // DataFromManageApplications object.
            // Unnecessary for getVacancies and getApplication, but necessary for updateApplicationAndVacancies
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            DataFromManageApplications data = gson.fromJson (jStr, DataFromManageApplications.class);


            // Next, put the response together.

            // Set the content type:
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            Writer writer = resp.getWriter ();

            String action = data.servletAction;
            if (action.equals("getVacancies")) {
                getVacancies();
            }


            // Write it out and, most importantly, flush():
            writer.write(outputJson);
            writer.flush();

            // Debugging:
            System.out.println ("outputJson in Servlet: " + outputJson);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    } // End handleRequest

    void getVacancies()
    {
        try {
            String sql = "SELECT * FROM RINK";
            ResultSet rs = statement.executeQuery(sql);

            outputJson = "[";
            while (rs.next()) {
                outputJson += "{\"location\":\"" + rs.getString(1) +
                        "\", \"deskvacancies\": \"" + rs.getString(2) +
                        "\", \"icevacancies\": \"" + rs.getString(3) + "\"},";
            }
            System.out.println(outputJson);
            outputJson += "]";
/*            outputJson = "" +
                    "[" +
                    "{\"location\":\"Bethesda\", \"deskvacancies\": \"5\", \"icevacancies\": \"5\"}," +
                    "{\"location\": \"Rockville\", \"deskvacancies\": \"5\", \"icevacancies\": \"5\"}," +
                    "{\"location\": \"SomePlace\", \"deskvacancies\": \"340870987\", \"icevacancies\": \"48\"}" +
                    "]";*/
            System.out.println("outputJson: "+ outputJson);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
