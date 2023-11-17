import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import com.google.gson.*;

// The generic fields will be populated depending on
// which js file the data comes from.
class Data {
    String login;
    String password;
    String registerLogin;
    String registerPassword;


    String servletAction;

}

public class MyServlet extends HttpServlet {

    VacationInfo vInfo;

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("MyServlet: doPost");
        //handleRequest(req, resp);
    }


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    {
        System.out.println ("MyServlet: doGet");
        //handleRequest(req, resp);
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
            // VacationInfo object.
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            VacationInfo vInfo = gson.fromJson (jStr, VacationInfo.class);
            vInfo.message = "Thank you, " + vInfo.name + ". We'll be in touch.";
            System.out.println ("Received: user=" + vInfo.name);
            System.out.println ("Received: message=" + vInfo.message);

            // Next, put the response together.

            // Set the content type:
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            Writer writer = resp.getWriter ();


            // WRITE THE ONE LINE OF CODE TO build the output json
            // from the vInfo object
            String outputJson = gson.toJson (vInfo);

            // Write it out and, most importantly, flush():
            writer.write(outputJson);
            writer.flush();

            // Debugging:
            System.out.println ("outputJson in Servlet: " + outputJson);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

}
