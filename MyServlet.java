import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import com.google.gson.*;

// This class serves the dataToServer object in js files.
// Update this clas as you update the js object.
class DataFromJS {
    String login;
    String password;
    String registerLogin;
    String registerPassword;


    String servletAction;

}

public class MyServlet extends HttpServlet {

    static Connection conn;
    static Statement statement;
    // Use constructor to connect to the database.
    // There is a single connection for the life of this servlet,
    // which is opened when the MyBCServlet class instance
    // is first created.
    public MyServlet () {
        try {
            Class.forName ("org.h2.Driver");
            conn = DriverManager.getConnection (
                    "jdbc:h2:~/Desktop/myservers/databases/rinkjobs",
                    "sa",
                    ""
            );
            statement = conn.createStatement();
            System.out.println ("MyServlet: successful connection to H2 dbase");
        }
        catch (Exception e) {
            // Bad news if we reach here.
            e.printStackTrace ();
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("MyServlet: doPost");
        handleRequest(req, resp);
    }


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("MyServlet: doGet");
        handleRequest(req, resp);
    }


    public void handleRequest(HttpServletRequest req, HttpServletResponse resp)    {
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
            // DataFromJS object.
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            DataFromJS data = gson.fromJson (jStr, DataFromJS.class);
            System.out.println ("Received: login = " + data.login);
            System.out.println ("Received: password = " + data.password);
            System.out.println ("Received: servletAction = " + data.servletAction);


            // Next, put the response together.

            // Set the content type:
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            Writer writer = resp.getWriter ();


            // WRITE THE ONE LINE OF CODE TO build the output json
            String outputJson = "";

            // Assign a value to outputJson depending on servletAction
            String action = data.servletAction;
            if (action.equals("login")){
                String uid = confirmUser(data.login, data.password);
                System.out.println("uid: " + uid);
                outputJson = "{\"uid\":" + uid + "}";
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
    } // End handleRequest()

    String confirmUser (String login, String password)
    {
        try {
            String uid = null;
            String sql = "" +
                    "SELECT UID FROM USER " +
                    "WHERE LOGIN = '" + login + "' " +
                    "AND PASSWORD = '" + password + "' ";
            ResultSet rs = statement.executeQuery(sql);

            while (rs.next()) {
                uid= rs.getString(1);
                System.out.println ("uid: " + uid);
            }
            return uid;
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
