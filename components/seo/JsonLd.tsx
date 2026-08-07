interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a schema.org JSON-LD <script> tag from a plain data object. `<` (and
 * the `</script>` sequence) is escaped to its unicode form so no string value
 * can break out of the script element — safe even if dynamic content is added.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
