import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class SettingsServer {

    static final int PORT = 8080;
    static final String FILE = "settings.txt";

    public static void main(String[] args) throws Exception {

        createSettingsFile();

        HttpServer server = HttpServer.create(
                new InetSocketAddress(PORT), 0
        );

        // HOME PAGE
        server.createContext("/", exchange -> {

            String html = readFile("index.html");

            sendResponse(
                    exchange,
                    html,
                    "text/html"
            );
        });

        // SETTINGS API
        server.createContext("/api/settings", exchange -> {

            if (exchange.getRequestMethod().equals("GET")) {

                String settings = readFile(FILE);

                sendResponse(
                        exchange,
                        settings,
                        "application/json"
                );

            } else if (exchange.getRequestMethod().equals("POST")) {

                String data = new String(
                        exchange.getRequestBody().readAllBytes(),
                        StandardCharsets.UTF_8
                );

                writeFile(FILE, data);

                String response =
                        "{\"message\":\"Settings saved successfully\"}";

                sendResponse(
                        exchange,
                        response,
                        "application/json"
                );
            }
        });

        // RESET SETTINGS API
        server.createContext("/api/reset", exchange -> {

            if (exchange.getRequestMethod().equals("POST")) {

                String defaultSettings =
                        "{"
                        + "\"darkMode\":true,"
                        + "\"autoSave\":true,"
                        + "\"language\":\"English\","
                        + "\"notifications\":true,"
                        + "\"sound\":true"
                        + "}";

                writeFile(FILE, defaultSettings);

                String response =
                        "{"
                        + "\"message\":\"Settings reset successfully\","
                        + "\"darkMode\":true,"
                        + "\"autoSave\":true,"
                        + "\"language\":\"English\","
                        + "\"notifications\":true,"
                        + "\"sound\":true"
                        + "}";

                sendResponse(
                        exchange,
                        response,
                        "application/json"
                );
            }
        });

        server.start();

        System.out.println("--------------------------------");
        System.out.println("Management Made Easy Backend");
        System.out.println("--------------------------------");
        System.out.println("Backend running!");
        System.out.println("Open: http://localhost:8080");
    }

    // CREATE DEFAULT SETTINGS FILE
    static void createSettingsFile() throws IOException {

        File file = new File(FILE);

        if (!file.exists()) {

            String defaultSettings =
                    "{"
                    + "\"darkMode\":true,"
                    + "\"autoSave\":true,"
                    + "\"language\":\"English\","
                    + "\"notifications\":true,"
                    + "\"sound\":true"
                    + "}";

            writeFile(FILE, defaultSettings);
        }
    }

    // READ FILE
    static String readFile(String filename) throws IOException {

        return new String(
                java.nio.file.Files.readAllBytes(
                        java.nio.file.Paths.get(filename)
                ),
                StandardCharsets.UTF_8
        );
    }

    // WRITE FILE
    static void writeFile(
            String filename,
            String content
    ) throws IOException {

        java.nio.file.Files.write(
                java.nio.file.Paths.get(filename),
                content.getBytes(StandardCharsets.UTF_8)
        );
    }

    // SEND RESPONSE
    static void sendResponse(
            HttpExchange exchange,
            String response,
            String contentType
    ) throws IOException {

        exchange.getResponseHeaders()
                .set("Content-Type", contentType);

        byte[] bytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                200,
                bytes.length
        );

        OutputStream output =
                exchange.getResponseBody();

        output.write(bytes);
        output.close();
    }
}