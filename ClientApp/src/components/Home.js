import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            passwordConfirm: '',
            validationErrors: {
                length: false,
                numberEspecialChar: false,
                match: false,
                commonlyUsed: false
            }
        };
    }

    handlePasswordFieldChange(e) {
        const password = e.target.value;
        this.setState({ password }, () => {
            this.checkPasswordLength();
            this.checkPasswordMatch();
            this.checkPasswordNumberEspecialChar();
        });
    }

    handleConfirmFieldChange(e) {
        const passwordConfirm = e.target.value;
        this.setState({ passwordConfirm }, () => {
            this.checkPasswordLength();
            this.checkPasswordMatch();
            this.checkPasswordNumberEspecialChar();
        });
    }

    checkPasswordLength() {
        const { password } = this.state;
        const lengthError = (password.length >= 7 && password.length <= 14);

        this.setState(prevState => ({
            validationErrors: {
                ...prevState.validationErrors,
                length: lengthError
            }
        }));
    }

    checkPasswordNumberEspecialChar() {
        const { password } = this.state;
        const numberEspecialChar = /\d/.test(password) && /[!£$^*#]/.test(password);

        this.setState(prevState => ({
            validationErrors: {
                ...prevState.validationErrors,
                numberEspecialChar: numberEspecialChar
            }
        }));
    }

    checkPasswordMatch() {
        const { password, passwordConfirm } = this.state;
        const matchError = password === passwordConfirm;

        this.setState(prevState => ({
            validationErrors: {
                ...prevState.validationErrors,
                match: matchError
            }
        }));
    }

    async submitPassword() {
        const { password, validationErrors } = this.state;
        const isValid = Object.values(validationErrors).some(error => error);

        if (isValid) {
            await this.postPassword(password);
        } else {
            console.log("Password does not meet the criteria");
        }
    }

    render() {
        const { validationErrors } = this.state;
        const isSubmitEnabled = validationErrors.length && validationErrors.numberEspecialChar && validationErrors.match;

        return (
            <div className="container">
                <div className="row mt-3">
                    <div className="col">
                        <h3>Change your password</h3>
                        <div>
                            <div className="form-group">
                                <label htmlFor="password">New Password:</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => this.handlePasswordFieldChange(e)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordConfirm">Re-type new password:</label>
                                <input type="password" className="form-control" id="passwordConfirm" placeholder="Password" onChange={(e) => this.handleConfirmFieldChange(e)} />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={() => this.submitPassword()} disabled={!isSubmitEnabled}>Submit</button>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col">
                        <h4>Password Validation</h4>
                        <ol>
                            <li>Password must be between 7-14 characters in length <i className={`bi ${validationErrors.length ? 'bi-check-lg' : 'bi-x-lg'}`}></i></li>
                            <li>Password must contain at least 1 number and at least one special character <i className={`bi ${validationErrors.numberEspecialChar ? 'bi-check-lg' : 'bi-x-lg'}`}></i></li>
                            <li>Allowed special characters are <code>!£$^*#</code> <i className={`bi ${validationErrors.numberEspecialChar ? 'bi-check-lg' : 'bi-x-lg'}`}></i></li>
                            <li>Both passwords must be identical <i className={`bi ${validationErrors.match ? 'bi-check-lg' : 'bi-x-lg'}`}></i></li>
                            <li>Password must be validated against a list of commonly used passwords <i className={`bi ${validationErrors.commonlyUsed ? 'bi-check-lg' : 'bi-x-lg'}`}></i></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    async validateCurrentPassword(password) {
        console.log("Validate password against common passwords...");
        const response = await fetch(`/password/validate?password=${password}`);
        const commonlyUsedPassword = await response.json();

        return commonlyUsedPassword;
    }

    async postPassword(password) {
        console.log("Updating password...");

        await fetch('/password/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password
            })
        })
            .then(response => response.json())
            .then(isCommonPassword => {
                this.setState(prevState => ({
                    validationErrors: {
                        ...prevState.validationErrors,
                        commonlyUsed: !isCommonPassword
                    }
                }));
            });
    }
}
