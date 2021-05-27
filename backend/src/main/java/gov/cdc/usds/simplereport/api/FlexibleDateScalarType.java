package gov.cdc.usds.simplereport.api;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.GraphQLScalarType;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlexibleDateScalarType {
  private static final DateTimeFormatter US_DASHDATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
  private static final DateTimeFormatter US_SLASHDATE_FORMATTER =
      DateTimeFormatter.ofPattern("MM/dd/yyyy");

  @Bean
  public GraphQLScalarType FlexibleDateScalar() {
    return GraphQLScalarType.newScalar()
        .name("FlexibleDate")
        .description("a scalar for multiple date formats. currently yyyy-MM-dd and MM/dd/yyyy")
        .coercing(
            new Coercing() {
              private LocalDate convertImpl(Object input) {
                if (input instanceof String) {
                  if (((String) input).contains("/")) {
                    return LocalDate.parse((String) input, US_SLASHDATE_FORMATTER);
                  } else if (((String) input).contains("-")) {
                    return LocalDate.parse((String) input, US_DASHDATE_FORMATTER);
                  }
                } else if (input instanceof LocalDate) {
                  return (LocalDate) input;
                }
                return null;
              }

              @Override
              public String serialize(Object dataFetcherResult) {
                return "";
              }

              @Override
              public LocalDate parseValue(Object input) {
                LocalDate result = convertImpl(input);
                if (result == null) {
                  throw new CoercingParseValueException(
                      "Invalid value '" + input + "' for LocalDate");
                }
                return result;
              }

              @Override
              public LocalDate parseLiteral(Object input) {
                String value = ((StringValue) input).getValue();
                LocalDate result = convertImpl(value);
                if (result == null) {
                  throw new CoercingParseLiteralException(
                      "Invalid value '" + input + "' for LocalDate");
                }

                return result;
              }
            })
        .build();
  }
}
