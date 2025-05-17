package com.example.springsocial.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.springsocial.config.AppProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    private AppProperties appProperties;

    public TokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String createToken(Authentication authentication) {
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

    // Convert the secret string to a key (HS512 requires a long enough key)
    SecretKey key = Keys.hmacShaKeyFor(appProperties.getAuth().getTokenSecret().getBytes());

    return Jwts.builder()
            .setSubject(Long.toString(userPrincipal.getId()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
}

public Long getUserIdFromToken(String token) {
    SecretKey key = Keys.hmacShaKeyFor(appProperties.getAuth().getTokenSecret().getBytes());

    Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

    return Long.parseLong(claims.getSubject());
}

public boolean validateToken(String authToken) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(appProperties.getAuth().getTokenSecret().getBytes()))
            .build()
            .parseClaimsJws(authToken);
        return true;
    } catch (SecurityException | MalformedJwtException ex) {
        logger.error("Invalid JWT signature or token");
    } catch (ExpiredJwtException ex) {
        logger.error("Expired JWT token");
    } catch (UnsupportedJwtException ex) {
        logger.error("Unsupported JWT token");
    } catch (IllegalArgumentException ex) {
        logger.error("JWT claims string is empty.");
    }
    return false;
}
}
