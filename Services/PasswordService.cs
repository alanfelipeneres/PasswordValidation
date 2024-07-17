namespace PasswordSetter.Services
{
    public class PasswordService : IPasswordService
    {
        public bool IsCommonPassword(string password)
        {
            return GetCommonPasswords().Contains(password);
        }

        public List<string> GetCommonPasswords()
        {
            return new List<string>()
            {
                "password123", 
                "12345", 
                "admin"
            };
        }

        public bool CheckLength(string password)
        {
            return password.Length >= 7 && password.Length <= 14;
        }

        public bool HasNumber(string password)
        {
            return password.Any(char.IsDigit);
        }

        public bool HasSpecialCharacter(string password)
        {
            var specialCharacters = "!£$^*#";
            return password.Any(c => specialCharacters.Contains(c));
        }
    }
}
