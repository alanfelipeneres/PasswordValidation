using Microsoft.AspNetCore.Mvc;
using PasswordSetter.Services;

namespace PasswordSetter.Controllers;

[ApiController]
[Route("[controller]")]
public class Password
{
    private readonly IPasswordService _passwordService;
    private readonly ILogger<Password> _logger;

    public Password(
        IPasswordService passwordService,
        ILogger<Password> logger)
    {
        _passwordService = passwordService;
        _logger = logger;
    }
    
    // Replace this with an endpoint that returns true if the request submitted in common-passwords.txt (in solution) 
    [HttpPost]
    [Route("validate")]
    public bool Validate([FromBody] UpdatePasswordRequest request)
    {
        _logger.LogInformation("{MethodName}: GET method called", nameof(Validate));


        return !string.IsNullOrWhiteSpace(request.Password) &&
            _passwordService.CheckLength(request.Password) &&
            _passwordService.HasNumber(request.Password) &&
            _passwordService.HasSpecialCharacter(request.Password) &&
            _passwordService.IsCommonPassword(request.Password);
    }

    //[HttpPost]
    //[Route("")]
    //public bool UpdatePassword(UpdatePasswordRequest password)
    //{
    //    return true;
    //}
}

public class UpdatePasswordRequest()
{
    public string Password { get; set; }
}