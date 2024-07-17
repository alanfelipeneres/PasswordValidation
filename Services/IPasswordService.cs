namespace PasswordSetter.Services
{
    public interface IPasswordService
    {
        bool IsCommonPassword(string password);
        bool CheckLength(string password);
        bool HasNumber(string password);
        bool HasSpecialCharacter(string password);
    }
}
