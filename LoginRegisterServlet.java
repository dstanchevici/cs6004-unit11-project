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
class DataFromLoginRegister {
    String login;
    String password;
    String registerLogin;
    String registerPassword;


    String servletAction;

}

public class LoginRegisterServlet extends HttpServlet {

    // WRITE THE ONE LINE OF CODE TO build the output json
    static String outputJson = "";
    static Connection conn;
    static Statement statement;
    // Use constructor to connect to the database.
    // There is a single connection for the life of this servlet,
    // which is opened when the MyBCServlet class instance
    // is first created.
    public LoginRegisterServlet () {
        try {
            Class.forName ("org.h2.Driver");
            conn = DriverManager.getConnection (
                    "jdbc:h2:~/Desktop/myservers/databases/rinkjobs",
                    "sa",
                    ""
            );
            statement = conn.createStatement();
            System.out.println ("LoginRegisterServlet: successful connection to H2 dbase");
        }
        catch (Exception e) {
            // Bad news if we reach here.
            e.printStackTrace ();
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("LoginRegisterServlet: doPost");
        handleRequest(req, resp);
    }


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("LoginRegisterServlet: doGet");
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
            // DataFromLoginRegister object.
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            DataFromLoginRegister data = gson.fromJson (jStr, DataFromLoginRegister.class);
            System.out.println ("Received: login = " + data.login);
            System.out.println ("Received: password = " + data.password);
            System.out.println ("Received: password = " + data.registerLogin);
            System.out.println ("Received: password = " + data.registerPassword);
            System.out.println ("Received: servletAction = " + data.servletAction);


            // Next, put the response together.

            // Set the content type:
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            Writer writer = resp.getWriter ();

            // Assign a value to outputJson depending on servletAction
            String action = data.servletAction;
            if (action.equals("login")){
                confirmUser(data.login, data.password);
            }
            if (action.equals("register")){
                registerUser(data.registerLogin, data.registerPassword);
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

    // This method retrieves uid and role, if available,
    // and puts them in outputJason
    void confirmUser (String login, String password)
    {
        try {
            String uid = null;
            String role = null;
            boolean applied = false;

            String sql = "" +
                    "SELECT UID, ROLE " +
                    "FROM USER " +
                    "WHERE LOGIN = '" + login + "' " +
                    "AND PASSWORD = '" + password + "' ";
            ResultSet rs = statement.executeQuery(sql);

            if (rs.next()) {
                uid = rs.getString(1);
                role = rs.getString(2);
                System.out.println ("uid: " + uid);
                System.out.println ("role: " + role);
            }

            // If there is no account (and thus no UID), return failed login.
            if (uid == null) {
                outputJson = "{\"uid\":" + uid + ", \"role\":" + role + "}";
                System.out.println("outputJson: "+ outputJson);
            }
            // If there is an account, return uid, role, and whether already applied or not
            else {
                sql = "SELECT UID FROM APPLICATION WHERE UID='" + uid + "'";
                rs = statement.executeQuery(sql);
                if (rs.next()) {
                    applied = true;
                }
                outputJson = "{\"uid\":\"" + uid + "\", \"role\":\"" + role + "\", \"applied\":" + applied + "}";
                System.out.println("outputJson: "+ outputJson);
            }

        }
        catch (Exception e) {
            e.printStackTrace();
            outputJson = "{\"uid\":" + null + ", \"role\":" + null + "}";
        }
    }

    void registerUser(String registerLogin, String registerPassword) {
        try {
            System.out.println("Entered registerUser()");
            String uid = null;

            // If the entered login/password combination exists, delete this profile before inserting
            String sql = "DELETE FROM USER WHERE LOGIN='" + registerLogin + "' AND PASSWORD='" + registerPassword + "'";
            statement.executeUpdate (sql);

            // Determine UID
            sql = "SELECT MAX(UID) FROM USER";
            ResultSet rs = statement.executeQuery(sql);
            if (rs.next()) {
                String maxID = rs.getString(1);
            }
            int newUID = Integer.parseInt(rs.getString(1)) + 1;

            sql = "INSERT INTO USER VALUES (" +
                    "" + newUID + ", " +
                    "'" + registerLogin + "', " +
                    "'" + registerPassword + "', " +
                    "'applicant')";
            statement.executeUpdate (sql);

            sql = "SELECT * FROM USER WHERE UID=" + newUID;
            rs = statement.executeQuery(sql);
            if (rs.next()) {
                System.out.println(rs.getString(1));
                System.out.println(rs.getString(2));
                System.out.println(rs.getString(3));
                System.out.println(rs.getString(4));
                outputJson = "{\"uid\":" + newUID + "}";
            }
            else {
                outputJson = "{\"uid\":" + null + "}";
            }

        }
        catch (Exception e) {
            e.printStackTrace();
            outputJson = "{\"uid\":" + null + "}";
        }

    }
}
