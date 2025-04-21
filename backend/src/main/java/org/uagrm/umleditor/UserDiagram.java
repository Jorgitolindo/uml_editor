package org.uagrm.umleditor;

import java.util.Map;

public record UserDiagram(String id, String username, Map<String, Object> diagram) {
}
