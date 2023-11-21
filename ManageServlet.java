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
            else if (action.equals("getApplicationsUnderReview")) {
                getApplicationsUnderReview();
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

    // The keyword synchronized is used to handle multiple simultaneous users.
    // It is redundant now b/c there is only one manager in the USER db.
    // However, there may be more than one manager.
    synchronized void getVacancies()
    {
        try {
            String sql = "SELECT * FROM RINK";
            ResultSet rs = statement.executeQuery(sql);

            outputJson = "[";
            while (rs.next()) {
                outputJson += "{\"location\":\"" + rs.getString(1) +
                        "\", \"deskvacancies\":\"" + rs.getString(2) +
                        "\", \"icevacancies\":\"" + rs.getString(3) + "\"},";
            }
            //System.out.println(outputJson);

            // To remove the comma after last object item.
            if (outputJson.length() > 0 && outputJson.charAt(outputJson.length()-1)==',') {
                outputJson = outputJson.substring(0, outputJson.length()-1);
            }
            //System.out.println(outputJson);
            outputJson += "]";

            System.out.println("outputJson: "+ outputJson);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    synchronized void getApplicationsUnderReview (){
        try {
            String sql = "SELECT * FROM APPLICATION WHERE STATUS='under_review'";
            ResultSet rs = statement.executeQuery(sql);
            outputJson = "[";
            while (rs.next()) {
                outputJson += "{\"uid\":\"" + rs.getString(1) +
                        "\", \"firstName\":\"" + rs.getString(2) +
                        "\", \"lastName\":\"" + rs.getString(3) +
                        "\", \"age\":\"" + rs.getString(4) +
                        "\", \"email\":\"" + rs.getString(5) +
                        "\", \"locationPreference\":\"" + rs.getString(6) +
                        "\", \"jobPreference\":\"" + rs.getString(7) +
                        "\", \"skatingSkill\":\"" + rs.getString(8) +
                        "\", \"applicationDate\":\"" + rs.getString(9) +
                        "\", \"status\":\"" + rs.getString(10) +
                        "\", \"locationAssignment\":\"" + rs.getString(11) +
                        "\", \"jobAssignment\":\"" + rs.getString(12) +
                        "\", \"reviewDate\":\"" + rs.getString(13) + "\"},";
                System.out.println(outputJson);
            }
            //System.out.println(outputJson);

            // To remove the comma after last object item.
            if (outputJson.length() > 0 && outputJson.charAt(outputJson.length()-1)==',') {
                outputJson = outputJson.substring(0, outputJson.length()-1);
            }
            //System.out.println(outputJson);
            outputJson += "]";
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
