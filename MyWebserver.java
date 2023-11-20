
import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.servlet.*;
import org.eclipse.jetty.util.thread.*;
import org.eclipse.jetty.http.*;
import org.eclipse.jetty.server.handler.*;

public class MyWebserver {

    public static void main( String[] args ) throws Exception
    {
        try {
            Server server = new Server (40104);   // Port#

            ResourceHandler rHandler = new ResourceHandler();
            rHandler.setResourceBase(".");                     // Current dir.
            ContextHandler cHandler = new ContextHandler("/"); // Generic URL
            cHandler.setHandler(rHandler);

            // Now the servlets: in this case just one.
            ServletContextHandler sHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);

            // We want the form URL /form to go to MyFormServlet
            sHandler.addServlet(new ServletHolder(new LoginRegisterServlet()),"/loginregisterServlet");
            sHandler.addServlet(new ServletHolder(new ManageServlet()),"/manageServlet");
            // Put all of these "handlers" into the server.
            ContextHandlerCollection contexts = new ContextHandlerCollection();
            contexts.setHandlers(new Handler[] { cHandler, sHandler });
            server.setHandler(contexts);

            // Start the server.
            server.start();
            System.out.println ("Webserver started, ready for browser connections");
            server.join();
        }
        catch (Exception e) {
            // We really don't want to reach here.
            e.printStackTrace();
        }
    }

}
